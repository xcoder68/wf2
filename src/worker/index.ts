// @ts-ignore
import { default as handler } from "../../.open-next/worker.js";
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep, DurableObject } from "cloudflare:workers";
 
export default {
  fetch: handler.fetch,
  async scheduled(event) {
    console.log('scheduled', event);
  },
} satisfies ExportedHandler<CloudflareEnv>;
 
// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-ignore `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from "../../.open-next/worker.js";


async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class DemoDO extends DurableObject {
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    // Required, as we're extending the base class.
    super(ctx, env);
  }

  async sayHello() {
    let result = this.ctx.storage.sql
      .exec("SELECT 'Hello, World!' as greeting")
      .one();
    return result.greeting;
  }
}

export class DemoWorkflow extends WorkflowEntrypoint<CloudflareEnv, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do('sleep', async () => {
      console.log(event)
      console.log('before sleep 1000', new Date().toISOString());
      await sleep(1000);
      console.log('after sleep 1000', new Date().toISOString());
    });

    await step.do('sleep2', async () => {
      console.log('before sleep 2000', new Date().toISOString());
      await sleep(2000);
      console.log('after sleep 2000', new Date().toISOString());
    });

  }
};
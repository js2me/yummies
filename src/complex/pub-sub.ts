export type SubFn<PubArgs extends any[] = any[]> = (...args: PubArgs) => void;

/**
 * The Publish-Subscribe pattern, which allows objects to interact with each other
 * through an event system. Subscribers can subscribe to events and receive notifications
 * when these events occur. The last published data can be accessed through the `data` property.
 */
export class PubSub<PubArgs extends any[] = any[]> {
  /**
   * The last published data. This value can be null if no publication has occurred yet.
   * It allows subscribers to receive the last published data when they subscribe.
   */
  data: PubArgs | null = null;

  /**
   * An array of subscriber functions (sub) that will be called
   * when an event is published. Each subscriber must match the type SubFn,
   * taking the arguments that will be passed to it when the publisher calls pub.
   */
  subs: SubFn<PubArgs>[] = [];

  /**
   * A function that is used to publish an event. When this function is called,
   * all subscribers in the `subs` array will be called with the passed arguments.
   */
  pub(...args: PubArgs) {
    this.data = args;
    this.subs.forEach((sub) => {
      sub(...args);
    });
  }

  /**
   * A function to unsubscribe from events. When a subscriber function (sub) is passed,
   * it will be removed from the `subs` array, and will no longer receive notifications.
   */
  unsub(sub: SubFn<PubArgs>) {
    this.subs = this.subs.filter((it) => it !== sub);
  }

  /**
   * A function to subscribe to events. When a subscriber function (sub) is passed,
   * it will be added to the `subs` array, and will receive notifications when the publisher calls pub.
   * Returns a function that can be used to unsubscribe from events.
   */
  sub(sub: SubFn<PubArgs>) {
    this.subs.push(sub);
    return () => this.unsub(sub);
  }
}

export const createPubSub = <PubArgs extends any[] = any[]>() =>
  new PubSub<PubArgs>();

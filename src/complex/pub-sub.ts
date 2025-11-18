export type SubFn<PubArgs extends any[] = any[]> = (...args: PubArgs) => void;

/**
 * The Publish-Subscribe pattern, which allows objects to interact with each other
 * through an event system. Subscribers can subscribe to events and receive notifications
 * when these events occur. The last published data can be accessed through the `data` property.
 */
export interface PubSub<PubArgs extends any[] = any[]> {
  (...args: PubArgs): void;

  /**
   * Last published arguments
   */
  lastPub: PubArgs | undefined;

  /**
   * An array of subscriber functions (sub) that will be called
   * when an event is published. Each subscriber must match the type SubFn,
   * taking the arguments that will be passed to it when the publisher calls pub.
   */
  subs: SubFn<PubArgs>[];

  /**
   * A function to unsubscribe from events. When a subscriber function (sub) is passed,
   * it will be removed from the `subs` array, and will no longer receive notifications.
   */
  unsub(sub: SubFn<PubArgs>): void;
  /**
   * A function to subscribe to events. When a subscriber function (sub) is passed,
   * it will be added to the `subs` array, and will receive notifications when the publisher calls pub.
   * Returns a function that can be used to unsubscribe from events.
   */
  sub(sub: SubFn<PubArgs>): VoidFunction;
}

export const createPubSub = <PubArgs extends any[] = any[]>() => {
  const pubSub = ((...args: PubArgs) => {
    pubSub.lastPub = args;
    pubSub.subs.forEach((sub) => {
      sub(...args);
    });
  }) as PubSub<PubArgs>;
  pubSub.lastPub = undefined;

  pubSub.subs = [];

  pubSub.unsub = (sub: SubFn<PubArgs>) => {
    pubSub.subs = pubSub.subs.filter((it) => it !== sub);
  };
  pubSub.sub = (sub: SubFn<PubArgs>) => {
    pubSub.subs.push(sub);
    return () => pubSub.unsub(sub);
  };

  return pubSub;
};

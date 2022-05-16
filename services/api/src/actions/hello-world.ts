import { CustomContext } from "../types";

export const helloWorldAction = (ctx: CustomContext) => {
  const { helloWorldService } = ctx.services;

  ctx.set("Content-Type", "application/json");
  ctx.body = JSON.stringify({
    message: helloWorldService.sayHello(),
  });
};

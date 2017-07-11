import test from "ava";
import { Greeter } from "./greeter";

test("Should greet with message", t => {
  const greeter = new Greeter("friend");
  t.is(greeter.greet(), "Bonjour, friend!");
});

# NamespacedKey

An implementation of a string-based NamespacedKey in the format of `namespace:key`. If you've ever got into technical Minecraft, you'll be familiar with these.

Has decent test coverage.

## Usage

```ts
import NamespacedKey from "@celery/namespacedkey"

const key = new NamespacedKey("namespace", "key")

console.log(key.toString()) // namespace:key
```
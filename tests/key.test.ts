import { expect, test } from "bun:test";
import NamespacedKey from "index";

test("null values", () => {
    expect(() => {
        //@ts-expect-error TypeScript is smart enough to know we shouldn't pass null into either of these, but we *want* this to be incorrect
        new NamespacedKey(null, "foo")
    }).toThrow("Namespace cannot be null")

    expect(() => {
        //@ts-expect-error TypeScript is smart enough to know we shouldn't pass null into either of these, but we *want* this to be incorrect
        new NamespacedKey("foo", null)
    }).toThrow("Key cannot be null")
})

test("key too long", () => {
    expect(() => {
        new NamespacedKey("foo".repeat(100), "bar")
    }).toThrow(`NamespacedKey must be less than 256 characters: ${"foo".repeat(100)}:bar`)
})

test("empty namespace and key", () => {
    expect(() => {
        new NamespacedKey("", "foo")
    }).toThrow("Invalid namespace. Must be [a-z0-9._-]: ")

    expect(() => {
        new NamespacedKey("foo", "")
    }).toThrow("Invalid key. Must be [a-z0-9/._-]: ")
})

test("invalid namespace and key", () => {
    expect(() => {
        new NamespacedKey("foo/bar", "baz")
    }).toThrow("Invalid namespace. Must be [a-z0-9._-]: foo/bar")
    
    expect(() => {
        new NamespacedKey("foo", "bar&baz")
    }).toThrow("Invalid key. Must be [a-z0-9/._-]: bar&baz")
})

test("strings are equal", () => {
    expect("namespaced:key").toEqual(new NamespacedKey("namespaced", "key").toString())
    expect("namespaced:key/foo").toEqual(new NamespacedKey("namespaced", "key/foo").toString())
    expect("namespaced:key/foo_bar").toEqual(new NamespacedKey("namespaced", "key/foo_bar").toString())
    expect("namespaced:key/foo_bar-baz").toEqual(new NamespacedKey("namespaced", "key/foo_bar-baz").toString())
    expect("namespaced:key/foo_bar-baz.qux").toEqual(new NamespacedKey("namespaced", "key/foo_bar-baz.qux").toString())
})

test("equals", () => {
    expect(new NamespacedKey("foo", "bar").equals(new NamespacedKey("foo", "bar"))).toBeTrue()
    expect(new NamespacedKey("foo", "bar").equals(new NamespacedKey("foo", "baz"))).toBeFalse()
})

test("fromString", () => {
    expect(() => {
        NamespacedKey.fromString("foo:bar:baz")
    }).toThrow("String foo:bar:baz cannot be a NamespacedKey")

    expect(NamespacedKey.fromString("foo:bar")).toEqual(new NamespacedKey("foo", "bar"))
})
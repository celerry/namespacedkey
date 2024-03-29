import crypto from "node:crypto"

const validNamespace: RegExp = /^[a-z0-9._-]+$/
const validKey: RegExp = /^[a-z0-9/._-]+$/

/**
 * represents a string based key which consists of two components - a namespace and a key.
 *
 * namespaces may only contain lowercase alphanumeric characters, periods, underscores, and hyphens.
 *
 * keys may only contain lowercase alphanumeric characters, periods, underscores, hyphens, and forward slashes.
 *
 * @example
 * ```ts
 * import NamespacedKey from "@celery/namespacedkey"
 *
 * const key = new NamespacedKey("namespace", "key")
 *
 * console.log(key.toString()) // namespace:key
 * ```
 */
export default class NamespacedKey {
    public namespace: string
    public key: string

    /**
     * create a new key.
     *
     * namespaces may only contain lowercase alphanumeric characters, periods, underscores, and hyphens.
     *
     * keys may only contain lowercase alphanumeric characters, periods, underscores, hyphens, and forward slashes.
     *
     * @param namespace namespace
     * @param key key
     */
    constructor(namespace: string, key: string) {
        if (namespace == null) {
            throw new Error("Namespace cannot be null")
        } else if (key == null) {
            throw new Error("Key cannot be null")
        }

        this.namespace = namespace.toLowerCase()
        this.key = key.toLowerCase()

        if (!validNamespace.test(this.namespace)) {
            throw new Error(`Invalid namespace. Must be [a-z0-9._-]: ${this.namespace}`)
        } else if (!validKey.test(this.key)) {
            throw new Error(`Invalid key. Must be [a-z0-9/._-]: ${this.key}`)
        }

        if (this.toString().length > 256) {
            throw new Error(`NamespacedKey must be less than 256 characters: ${this.toString()}`)
        }
    }

    public toString(): string {
        return this.namespace + ":" + this.key
    }

    public equals(other: NamespacedKey): boolean {
        if(other == null) {
            return false
        }

        return other.namespace === this.namespace && other.key === this.key
    }

    /**
     * get a random key in a given namespace.
     * 
     * @param namespace namespace to create the key in 
     * @returns new key 
     */
    public static randomKey(namespace: string): NamespacedKey {
        return new NamespacedKey(namespace, crypto.randomUUID().toString())
    }

    /**
     * get a NamespacedKey from a string-ified NamespacedKey
     * @param value string-ified NamespacedKey
     * @returns a NamespacedKey
     */
    public static fromString(value: string): NamespacedKey {
        const split = value.split(":")
        if(split.length != 2) {
            throw new Error(`String ${value} cannot be a NamespacedKey`)
        }
        return new NamespacedKey(split[0], split[1])
    }
}

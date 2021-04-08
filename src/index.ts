type ValueInfo<V> = {
	created: number;
	priority: number;
	value: V;
};
type ContextMap<V> = Map<string, ValueInfo<V>>;
type InternalMap<K, V> = Map<K, ContextMap<V>>;

/**
 * A map that can have multiple values for a single key, but only a single value ever gets returned.
 *
 * The value returned will be the latest value with the highest priority.
 */
export class PriorityMap<K, V> {
	private map: InternalMap<K, V> = new Map();
	private getCache = new Map<K, V>();

	private getOrDefault<K, V>(map: Map<K, V>, key: K, value: V) {
		const result = map.get(key);
		if (result !== undefined) return result;

		map.set(key, value);
		return value;
	}

	/**
	 * Retrieves the value associated with a specific key.
	 */
	get(key: K) {
		const cachedValue = this.getCache.get(key);
		if (cachedValue !== undefined) return cachedValue;

		const keyMap = this.map.get(key);
		if (keyMap) {
			let lastValue: ValueInfo<V> | undefined;
			for (const [_, valueList] of keyMap) {
				if (
					lastValue === undefined ||
					valueList.priority > lastValue.priority ||
					(valueList.created > lastValue.created && valueList.priority >= lastValue.priority)
				) {
					lastValue = valueList;
				}
			}
			if (lastValue) this.getCache.set(key, lastValue.value);
			return lastValue?.value;
		}
	}

	/**
	 * Associate a key to a value, taking into account the context and priority.
	 */
	set(key: K, value: V, context = "Default", priority = 1) {
		this.getCache.delete(key);
		const keyMap = this.getOrDefault(this.map, key, new Map());
		keyMap.set(context, {
			created: tick(),
			priority,
			value,
		});
	}

	/**
	 * Removes the specified key from the map.
	 */
	delete(key: K, context = "Default") {
		this.getCache.delete(key);
		const keyMap = this.map.get(key);
		if (keyMap) {
			keyMap.delete(context);
			if (keyMap.size() === 0) {
				this.map.delete(key);
			}
		}
	}

	/**
	 * Checks if this map has the specified key.
	 */
	has(key: K) {
		return this.get(key) !== undefined;
	}

	/**
	 * Converts a PriorityMap into a normal Map.
	 */
	toMap() {
		const realMap = new Map<K, V>();
		for (const [key] of this.map) {
			const value = this.get(key);
			if (value !== undefined) {
				realMap.set(key, value);
			}
		}
		return realMap;
	}

	/**
	 * Returns the keys in this PriorityMap as an array.
	 */
	keys() {
		const keys = new Array<K>();
		for (const [key] of this.map) {
			keys.push(key);
		}
		return keys;
	}

	/**
	 * Returns the values in this PriorityMap as an array.
	 */
	values() {
		const values = new Array<V>();
		for (const [_, value] of this.toMap()) {
			values.push(value);
		}
		return values;
	}

	/**
	 * Deletes all members of the PriorityMap.
	 */
	clear() {
		this.getCache.clear();
		this.map.clear();
	}

	/**
	 * Performs the specified action for each (element / pair of elements) in the Map
	 * @param cb A function that accepts up to three arguments. forEach calls the callbackfn function one time for each (element / pair of elements) in the array.
	 */
	forEach(cb: (value: V, key: K, arr: this) => void) {
		for (const [key, value] of this.toMap()) {
			cb(value, key, this);
		}
	}

	/**
	 * Returns the size of the PriorityMap.
	 */
	size() {
		return this.map.size();
	}

	/**
	 * Checks if this map is empty.
	 */
	isEmpty() {
		return this.size() > 0;
	}
}

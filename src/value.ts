/**
 * A container that holds multiple values while only exposing one.
 *
 * The value returned will be the latest value with the highest priority.
 */
export class PriorityValue<V> {
	private map: ContextMap<V> = new Map();
	private cache?: V;

	/**
	 * Retrieves the underlying value.
	 */
	get() {
		if (this.cache !== undefined) return this.cache;

		let lastValue: ValueInfo<V> | undefined;
		for (const [_, valueList] of this.map) {
			if (
				lastValue === undefined ||
				valueList.priority > lastValue.priority ||
				(valueList.created > lastValue.created && valueList.priority >= lastValue.priority)
			) {
				lastValue = valueList;
			}
		}
		if (lastValue) this.cache = lastValue.value;
		return lastValue?.value;
	}

	/**
	 * Associate a value, taking context and priority into account.
	 */
	set(value: V, context = "Default", priority = 1) {
		this.cache = undefined;
		this.map.set(context, {
			created: tick(),
			priority,
			value,
		});
	}

	/**
	 * Remove the specified context's value.
	 */
	delete(context = "Default") {
		this.cache = undefined;
		this.map.delete(context);
	}

	/**
	 * Remove all contexts' values.
	 */
	clear() {
		this.cache = undefined;
		this.map.clear();
	}

	/**
	 * Check if this PriorityValue currently holds a value.
	 */
	isEmpty() {
		return this.map.size() === 0;
	}
}

/**
 * A wrapper around PriorityValue<boolean\>
 */
export class PriorityBool extends PriorityValue<boolean> {
	/**
	 * Sets the underlying value to `true`
	 */
	enable(context = "Default", priority = 1) {
		this.set(true, context, priority);
	}

	/**
	 * Sets the underlying value to `false`
	 */
	disable(context = "Default", priority = 1) {
		this.set(false, context, priority);
	}
}

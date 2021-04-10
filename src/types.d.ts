type ValueInfo<V> = {
	created: number;
	priority: number;
	value: V;
};
type ContextMap<V> = Map<string, ValueInfo<V>>;
type InternalMap<K, V> = Map<K, ContextMap<V>>;

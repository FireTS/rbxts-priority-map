# @rbxts/priority-map
`@rbxts/priority-map` is a map that allows multiple values for a key, while only exposing a single value.

The value that is exposed via get(), values(), etc is determined using these rules:
1. Highest priority
2. Most recently assigned

## Installation:

```npm i @rbxts/priority-map```

## Example Usage
You can find the official documentation [here](https://fireboltofdeath.dev/docs/priority-map)
```typescript
import { PriorityMap } from "@rbxts/priority-map";

const map = new PriorityMap();

// Default context is "Default"
// Default priority is 1
map.set("A", "Value");
print(map.get("A")); // Value

map.set("B", "Value1", "Context");
map.set("B", "Value2", "AnotherContext");
print(map.get("B")); // Value2

map.delete("B", "AnotherContext");
print(map.get("B")); // Value1

map.set("B", "Value3", "MoreContexts", 0);
print(map.get("B")); // Value1

```

## Changelog

### 1.1.0
- Added PriorityValue and PriorityBool
- PriorityMap now uses PriorityValue under the hood

### 1.0.2
- Fix typo in README

### 1.0.1
- Add README
- Update description

### 1.0.0
- Inital release

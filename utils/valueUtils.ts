import {Assets, Data} from 'lucid-cardano'

function union (
    a1: Assets,
    a2: Assets
) {
    const a2Entries = Object.entries(a2);

    // initialize with clone of a1
    const result: Assets = { ...a1 };

    // add or append entries from a2
    a2Entries.forEach(([key, quantity]) => {
        if (result[key]) {
            result[key] += quantity;
        } else {
            result[key] = quantity;
        }
    });

    return result;
}

const PolicyId = Data.Bytes({ minLength: 28, maxLength: 28 });

const Value = Data.Map(
    PolicyId,
    Data.Map(Data.Bytes(), Data.Integer()),
  );
type Value = Data.Static<typeof Value>;

function fromAssets(assets: Assets): Value {
    const value = new Map<string, Map<string, bigint>>();
    if (assets.lovelace) value.set("", new Map([["", assets.lovelace]]));

    const units = Object.keys(assets);
    const policies = Array.from(
        new Set(
        units
            .filter((unit) => unit !== "lovelace")
            .map((unit) => unit.slice(0, 56)),
        ),
    );
    policies.sort().forEach((policyId) => {
        const policyUnits = units.filter((unit) => unit.slice(0, 56) === policyId);
        const assetsMap = new Map<string, bigint>();
        policyUnits.sort().forEach((unit) => {
            assetsMap.set(
                unit.slice(56),
                assets[unit],
            );
        });
        value.set(policyId, assetsMap);
    });
    return value;
}
  
function toAssets(value: Value): Assets {
    const result: Assets = { lovelace: value.get("")?.get("") || BigInt(0) };

    for (const [policyId, assets] of value) {
        if (policyId === "") continue;
        for (const [assetName, amount] of assets) {
        result[policyId + assetName] = amount;
        }
    }
    return result;
}

export {
    union,
    fromAssets,
    toAssets, 
    Value
};

export type {
    Value
}

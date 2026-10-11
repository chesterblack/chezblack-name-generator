import { useDocumentPresence } from "@vvd/sdk";
import type { Note, Pool as PoolType } from "./codec";
import { useT } from "./useT";
import { useMemo } from "react";
import { newId } from "./tool";
import Pool from "./Pool";
import PoolCreator from "./PoolCreator";

type Props = {
	data: {
		pools: Readonly<Record<string, PoolType>>
	}
	actions: {
		map(name: "pools"): {
			set(key: string, value: PoolType): void
			delete(key: string): void
		}
	};
	handle: Parameters<typeof useDocumentPresence>[0];
	canEdit: boolean;
	worldId: string;
}

export function Board( { data, actions, handle, canEdit, worldId }: Props ) {
	const t = useT();
	const { pools } = data;

  const addPool = ( data: PoolType ) => {
		const {name, list, viable_types} = data;
		actions.map("pools").set(
			newId(),
			{
				name: name ?? '',
				list: list ?? [],
				viable_types: viable_types ?? []
			}
		);
	};

	const poolElements = [];
	for (const key in pools) {
		const pool = pools[key];
		poolElements.push(
			<Pool pool={pool} id={key} />
		)
	}

	const clear = () => {
		for (const key in pools) {
			actions.map("pools").delete( key );
		}
	}

	return (
		<>
			<button onClick={clear}>Clear</button>
			<h1>Hello World!</h1>
			<PoolCreator addPool={addPool} />
			{poolElements}
		</>
	);
}
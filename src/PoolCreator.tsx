import { DefaultDocumentSkeleton } from "@vvd/sdk";

import { useEffect, useState } from "react";
import { CardType, emptyPool, Pool } from "./codec";
import Repeater from "./Repeater";
import { ReferencePicker } from "./ReferencePicker";
import { Hit } from "./tool";
import TypesPicker from "./TypesPicker";
import { useT } from "./useT";
import useAllCardTypes from "./useAllTypes";

type Props = {
	addPool: (data: Pool) => void
}

export default function PoolCreator( { addPool }: Props ) {
	const { allTypes, typesLoaded } = useAllCardTypes();
	const [ pool, setPool ] = useState<Pool>( emptyPool );

	if ( !typesLoaded ) {
		return <DefaultDocumentSkeleton />;
	}

	const setList = ( list: string[] ) => {
		setPool( { ...pool, list } );
	}

	const setTypes = ( types: string[] ) => {
		const typeIds = allTypes.filter( v => types.includes( v.name ) ).map( v => v.id );
		setPool( { ...pool, viable_types: typeIds } );
	}

	const cancel = () => {
		setPool( emptyPool );
	}

	const save = () => {
		addPool( pool );
		setPool( emptyPool );
	}

	const onPick = ( hit: CardType ) => {
		const foundIndex = pool.viable_types.findIndex( v => v === hit.id );

		const poolCopy = structuredClone( pool );

		if ( foundIndex >= 0 ) {
			poolCopy.viable_types.splice( foundIndex, 1 );
		} else {
			poolCopy.viable_types.push( hit.id );
		}

		setPool( poolCopy );
	}

	const poolTypeNames: string[] = [];
	pool.viable_types.forEach( id => {
		const name = allTypes.find( v => v.id === id )?.name;
		if ( name ) {
			poolTypeNames.push( name );
		}
	} );

	return (
		<div className="pool-creator">
			<h2>New Pool</h2>
			<fieldset>
				<label>
					Pool Name
				</label>
				<input
					type="text"
					style={{border: '1px solid white', borderRadius: 5}}
					value={pool?.name ?? ''}
					onChange={ e => setPool( {
						...pool,
						name: e.target.value
					} ) }
				/>
			</fieldset>
			<fieldset>
				<label>
					Types
				</label>
				<TypesPicker allTypes={ allTypes } onPick={ onPick } />
				<Repeater list={ poolTypeNames } setList={ setTypes } canEdit={ false } canAdd={ false } canDelete={ true } />
			</fieldset>
			<fieldset>
				<label>
					Names
				</label>
				<Repeater list={ pool.list } setList={ setList } />
			</fieldset>
			<button onClick={save}>Save</button>
			<button onClick={cancel}>Cancel</button>
		</div>
	);
}
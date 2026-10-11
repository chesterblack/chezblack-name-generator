import { useState } from "react";
import { emptyPool, Pool } from "./codec";
import Repeater from "./Repeater";

type Props = {
	addPool: (data: Pool) => void
}

export default function PoolCreator( { addPool }: Props ) {
	const [ pool, setPool ] = useState<Pool>( emptyPool );

	const setList = ( list: string[] ) => {
		setPool( { ...pool, list } );
	}

	const cancel = () => {
		setPool( emptyPool );
	}

	const save = () => {
		addPool( pool );
		setPool( emptyPool );
	}

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
					Names
				</label>
				<Repeater list={ pool.list } setList={ setList } />
			</fieldset>
			<button onClick={save}>Save</button>
			<button onClick={cancel}>Cancel</button>
		</div>
	);
}
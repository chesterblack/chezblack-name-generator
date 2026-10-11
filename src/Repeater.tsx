import { ElementType, useEffect, useState } from "react";

type Props = {
	list: string[]
	setList: ( list: string[] ) => void
}

export default function Repeater( { list, setList }: Props ) {
	const items =  list.length > 0 ? list : [ '' ];

	const deleteItem = ( key: number ) => {
		if ( list.length < 2 ) {
			setList(['']);
			return;
		}

		const newItems = [ ...list ];
		newItems.splice( key, 1 );
		setList( newItems );
	};

	const addItem = ( key: number ) => {
		const newItems = [ ...list ];
		newItems.splice( key + 1, 0, '' );
		setList( newItems );
	};

	return (
		<div className="repeater">
			{ items.map( ( item, key ) => {
				return (
					<div className="repeater__item">
						<input
							type="text"
							value={ item }
							placeholder="New name"
							onChange={ e => {
								const newItems = [ ...list ];
								newItems[key] = e.target.value;
								setList( newItems );
							} }
						/>
						<button onClick={() => addItem( key )}>+</button>
						<button onClick={() => deleteItem( key )} disabled={ list.length === 0 }>-</button>
				</div>
				)
			} ) }
		</div>
	);
}
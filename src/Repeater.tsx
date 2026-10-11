import { ElementType, useEffect, useState } from "react";

type Props = {
	list: string[]
	setList: ( list: string[] ) => void
	canEdit?: boolean
	canDelete?: boolean
	canAdd?: boolean
}

export default function Repeater( {
	list,
	setList,
	canEdit = true,
	canDelete = true,
	canAdd = true
}: Props ) {
	const items =  list.length > 0 ? list : [];

	const deleteItem = ( key: number ) => {
		if ( list.length < 2 ) {
			setList([]);
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

	if ( list.length === 0 && canEdit ) {
		setList( [''] );
	}

	return (
		<div className="repeater">
			{ items.map( ( item, key ) => {
				return (
					<div className="repeater__item">
						{ canEdit &&
							<input
								autoFocus={ key === items.length - 1 }
								type="text"
								value={ item }
								placeholder="New name"
								onKeyUp={ (e) => {
									if ( e.key === 'Enter' ) {
										addItem( key );
									}
								} }
								onChange={ e => {
									const newItems = [ ...list ];
									newItems[key] = e.target.value;
									setList( newItems );
								} }
							/>
						}
						{ !canEdit &&
							<span>{ item }</span>
						}
						{ canAdd &&
							<button onClick={() => addItem( key )}>+</button>
						}
						{ canDelete &&
							<button onClick={() => deleteItem( key )} disabled={ list.length === 0 }>-</button>
						}
				</div>
				)
			} ) }
		</div>
	);
}
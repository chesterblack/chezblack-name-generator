import { HostIcon, useHost } from "@vvd/sdk";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useT } from "./useT";
import { CardType } from "./codec";

type Props = {
	allTypes: CardType[]
	onPick: ( hit: CardType ) => void
	onClose?: () => void
}

export default function TypesPicker( { allTypes, onPick, onClose: externalClose }: Props ) {
	const [ query, setQuery ] = useState("");
	const [ hits, setHits ] = useState<CardType[]>( allTypes );
	const [ active, setActive ] = useState(0);
	const [ closed, setClosed ] = useState(true);

	const t = useT();

	const onClose = () => {
		setClosed( true );
		if ( externalClose ) {
			externalClose();
		}
	}

	useEffect( () => {
		const results = search( query );
		setHits( results );
	}, [ query ] );

	const search = (query: string) => {
		const matches = allTypes.filter( type => {
			const regex = new RegExp( `.*${query}.*`, 'i' );
			return type.name.match( regex );
		} );

		return matches;
	}

	const total = hits?.length ?? 0;

	const choose = (i: number) => {
		if ( i < hits.length ) {
			onPick( hits[i] )
		}
	};

	const onKeyDown = ( e: KeyboardEvent<HTMLInputElement> ) => {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				onClose();
				break;

			case 'ArrowDown':
				e.preventDefault();
				setActive(
					( a ) => Math.min( a + 1, Math.max( 0, total - 1 ) )
				);
				break;

			case 'ArrowUp':
				e.preventDefault();
				setActive( ( a ) => Math.max( a - 1, 0 ) );
				break;

			case 'Enter':
				e.preventDefault();
				if ( total > 0 ) {
					choose(active);
				};
				break;

			default:
				break;
		}
	}

	return (
		<span style={{ display: "grid", gap: 2, minWidth: 220, padding: 4, borderRadius: 10, background: "rgba(20,22,29,0.97)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 14px 32px rgba(0,0,0,0.45)" }}>
			<input
				value={query}
				onChange={ e => { setQuery( e.target.value ) } }
				placeholder={ t("picker.search") }
				onKeyDown={ onKeyDown }
				onFocus={ () => setClosed( false ) }
				onBlur={ () => onClose() }
				style={{ padding: "7px 10px", borderRadius: 7, border: "none", outline: "none", background: "rgba(255,255,255,0.08)", color: "#fff", font: "inherit", fontSize: 13 }}
			/>
			{ !closed &&
				<span style={{ display: "grid", maxHeight: 240, overflowY: "auto" }}>
					{ hits.map((h, i) => (
						<button
							key={h.id}
							type="button"
							onMouseDown={
								(e) => {
									e.preventDefault();
									choose(i);
								}
							}
							onMouseEnter={() => setActive(i)}
							style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px", borderRadius: 7, border: "none", textAlign: "left", cursor: "pointer", font: "inherit", fontSize: 13, color: "#fff", background: i === active ? "rgba(255,255,255,0.12)" : "transparent" }}
						>
							<HostIcon icon={h.icon || "file-text"} size={13} />
							<span style={{ flex: 1, minWidth: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
								{h.name || t("common.untitled")}
							</span>
						</button>
					) ) }
					{ hits.length === 0 &&
						<span style={{ padding: "10px 12px", fontSize: 12, opacity: 0.5 }}>
							{t("picker.empty")}
						</span>
					}
				</span>
			}
		</span>
	);
}
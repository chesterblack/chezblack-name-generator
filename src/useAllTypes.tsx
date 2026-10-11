import { useEffect, useState } from "react";
import { useHost } from "@vvd/sdk";
import { CardType } from "./codec";

export default function useAllCardTypes() {
	const [ allTypes, setAllTypes ] = useState<CardType[]>([]);
	const typesPromise = useHost().types.all();

	useEffect(() => {
		( async() => {
			if ( !allTypes || allTypes.length === 0 ) {
				const newAllTypes = await typesPromise;
				setAllTypes( newAllTypes );
			}
		} )();
	}, [] );

	return {
		allTypes,
		typesLoaded: allTypes && allTypes.length > 0
	};
}
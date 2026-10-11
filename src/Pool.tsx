import { Pool as PoolType } from './codec';

type Props = {
	pool: PoolType
	id: string
}

export default function Pool( { pool, id }: Props ) {
	const { name, list, viable_types } = pool;

	return (
		<div>
			<h2>{name}</h2>
			<em>{id}</em>
			<ul>
				{list.map(item => <li>{item}</li>)}
			</ul>
			<hr />
		</div>
	);
}
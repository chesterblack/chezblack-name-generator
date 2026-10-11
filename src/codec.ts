import { defineStateCodec, field } from "@vvd/sdk"

/** One note on the board. linkedDocumentId points at a WORLD document — always an id, never a copy. */
export type Note = {
  text: string
  linkedDocumentId: string | null
  /** Creation time — a stable sort key every peer agrees on. */
  at: number
}

export type CardType = {
	id: string
	name: string
	icon: string
	color: string|null
	parentTypeId: string
}

export type Pool = {
  name: string
  list: string[]
  viable_types: string[]
}

export const emptyPool = {
  name: '',
  list: [],
  viable_types: []
}

export const codec = defineStateCodec({
  // A per-KEY map: two people adding or editing different notes at once BOTH land.
  pools: field.map<Pool>(),
})

export default codec

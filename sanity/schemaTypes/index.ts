import { type SchemaTypeDefinition } from 'sanity'
import { memberType } from './member'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [memberType],
}

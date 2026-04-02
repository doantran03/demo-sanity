import { type SchemaTypeDefinition } from 'sanity'
import { memberType } from './member'
import { authorType } from './author'
import { postType } from './post'
import { seriesType } from './series'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [memberType, authorType, postType, seriesType],
}

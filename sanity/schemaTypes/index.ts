import { type SchemaTypeDefinition } from 'sanity'
import { memberType } from './member'
import { authorType } from './author'
import { postType } from './post'
import { seriesType } from './series'
import { testType } from './test'
import { addressType } from './address'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [memberType, authorType, postType, seriesType, testType, addressType],
}

import { defineField, defineType } from 'sanity'

export const addressType = defineType({
  name: 'address',
  title: 'Addresses',
  type: 'object',
  fields: [
    defineField({
      name: 'street',
      title: 'Street',
      type: 'string',
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
    }),
    defineField({
      name: 'postcode',
      title: 'Postcode',
      type: 'string',
    }),
  ],
})
import { defineField, defineType } from 'sanity'

export const memberType = defineType({
  name: 'member',
  title: 'Members',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Full Name is required'),
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'dob',
      title: 'Date of Birth',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mid',
      title: 'Mother',
      type: 'reference',
      to: [{ type: 'member' }],
      options: {
        filter: 'gender == "female"',
      },
    }),
    defineField({
      name: 'fid',
      title: 'Father',
      type: 'reference',
      to: [{ type: 'member' }],
      options: {
        filter: 'gender == "male"',
      },
    }),
    defineField({
      name: 'pids',
      title: 'Partners',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'member' }],
          options: {
            filter: ({ document }) => {
              return {
                filter: '_id != $id',
                params: { id: document._id.replace('drafts.', '') }
              }
            }
          }
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'fullName',
      subtitle: 'gender',
      media: 'avatar',
    },
  },
})
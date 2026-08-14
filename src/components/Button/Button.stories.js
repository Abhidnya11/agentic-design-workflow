import Button from './Button.vue'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    label: {
      control: 'text',
      description: "Accessible label, rendered as the button's visible text.",
      table: { category: 'Required' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
      description: 'Visual style variant.',
      table: { category: 'Optional', defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant.',
      table: { category: 'Optional', defaultValue: { summary: 'md' } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute.',
      table: { category: 'Optional', defaultValue: { summary: 'button' } },
    },
    name: {
      control: 'text',
      description: 'Native name attribute, useful for form submission.',
      table: { category: 'Optional' },
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip text shown on hover (native title attribute).',
      table: { category: 'Optional' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the button and prevents click events.',
      table: { category: 'Optional', defaultValue: { summary: 'false' } },
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows a loading spinner and disables interaction while true.',
      table: { category: 'Optional', defaultValue: { summary: 'false' } },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler, called with the native MouseEvent (skipped while disabled or loading).',
      table: { category: 'Optional' },
    },
  },
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
  },
}

export const Playground = {}

export const Variants = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
      <div style="display:flex; gap:12px;">
        <Button v-bind="args" variant="primary" label="Primary" />
        <Button v-bind="args" variant="secondary" label="Secondary" />
        <Button v-bind="args" variant="ghost" label="Ghost" />
        <Button v-bind="args" variant="destructive" label="Destructive" />
      </div>
    `,
  }),
}

export const Sizes = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; gap:12px; align-items:center;">
          <Button v-bind="args" variant="primary" size="sm" label="Button" />
          <Button v-bind="args" variant="primary" size="md" label="Button" />
          <Button v-bind="args" variant="primary" size="lg" label="Button" />
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <Button v-bind="args" variant="secondary" size="sm" label="Button" />
          <Button v-bind="args" variant="secondary" size="md" label="Button" />
          <Button v-bind="args" variant="secondary" size="lg" label="Button" />
        </div>
      </div>
    `,
  }),
}

export const States = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; gap:12px;">
          <Button v-bind="args" variant="primary" label="Button" />
          <Button v-bind="args" variant="secondary" label="Button" />
        </div>
        <div style="display:flex; gap:12px;">
          <Button v-bind="args" variant="primary" label="Button" isDisabled />
          <Button v-bind="args" variant="secondary" label="Button" isDisabled />
        </div>
        <div style="display:flex; gap:12px;">
          <Button v-bind="args" variant="primary" label="Button" isLoading />
          <Button v-bind="args" variant="secondary" label="Button" isLoading />
        </div>
      </div>
    `,
  }),
}

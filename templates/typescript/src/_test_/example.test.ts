import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld', () => {
  it('renders the component', () => {
    const wrapper = mount(HelloWorld);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the default msg prop', () => {
    const wrapper = mount(HelloWorld);
    expect(wrapper.text()).toContain('Hello World');
  });

  it('renders custom msg prop', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Hello Vitest' }
    });
    expect(wrapper.text()).toContain('Hello Vitest');
  });

  it('increments count on button click', async () => {
    const wrapper = mount(HelloWorld);
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(button.text()).toContain('count is 1');
  });
});

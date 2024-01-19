import { UniStore } from './uni.store';

interface State {
  count: number;
}
class Store extends UniStore<State> {}

describe('UniStore', () => {
  // UniStore can be instantiated with an initial state and a name
  it('should instantiate UniStore with initial state and name', () => {
    const initialState = { count: 0 };
    const store = new Store({ initialState, name: 'TestStore' });

    expect(store.state).toEqual(initialState);
    expect(store.name).toEqual('TestStore');
  });

  // UniStore can update its state using an update function
  it('should update UniStore state using update function', () => {
    const initialState = { count: 0 };
    const store = new Store({ initialState });

    store.update(state => {
      state.count++;

      return state;
    });

    expect(store.state).toEqual({ count: 1 });
  });

  // UniStore can register a callback function for an event and execute it when the event occurs
  it('should register callback function for event and execute it when event occurs', () => {
    const initialState = { count: 0 };
    const store = new Store({ initialState });

    let callbackCalled = false;

    store.on('update', () => (callbackCalled = true));
    store.update(state => state);

    expect(callbackCalled).toBe(true);
  });

  // UniStore can be instantiated without a name
  it('should instantiate UniStore without a name', () => {
    const initialState = { count: 0 };
    const store = new Store({ initialState });

    expect(store.name).toEqual('Store');
  });
});

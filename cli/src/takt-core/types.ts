export interface State<S = string> {
  id: S;
  [key: string]: unknown;
}

export interface Action<A = string> {
  id: A;
}

export interface Observation<O = string> {
  id: O;
  [key: string]: unknown;
}

export type ObservationFn<S, O> = (state: S) => O;

export interface Trajectory<S, A> {
  states: S[];
  actions: A[];
}

export interface TrajectoryPrefix<S, A> {
  states: S[];
  actions: A[];
}

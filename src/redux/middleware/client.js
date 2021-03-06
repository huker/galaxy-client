import _ from "lodash";

export default function clientMiddleware(client) {
	return ({dispatch, getState}) => {
		return next => action => {
			if (typeof action === 'function') {
				return action(dispatch, getState);
			}

			const {promise, types, ...rest} = action;
			if (!promise) {
				return next(action);
			}

			const [REQUEST, SUCCESS, FAILURE] = types;
			next({...rest, type: REQUEST});

			if (_.has(getState(), ['auth', 'token'])) {
				client.setToken(getState().auth.token);
			}

			const actionPromise = promise(client);
			actionPromise.then(
				(result) => {
					next({...rest, result, type: SUCCESS})
				},
				(error) => {
					next({...rest, error, type: FAILURE})
				}
			).catch((error) => {
				console.error('MIDDLEWARE ERROR:', error);
				toastError(dispatch, client, error);
				next({...rest, error, type: FAILURE});
			});

			return actionPromise;
		};
	};
}

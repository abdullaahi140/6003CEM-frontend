import React from 'react';
import PropTypes from 'prop-types';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import HeartFilled from '@ant-design/icons/HeartFilled';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuthentication from '../hooks/useAuthentication';

interface Param {
	method: 'POST' | 'DELETE';
}

/**
 * Icon component handling favouriting dogs
 */
function FavIcon({ dogID }: { dogID: number }): JSX.Element {
	const { state: { accessToken } } = useAuthentication();
	const queryClient = useQueryClient();

	/**
	 * Function that adds or remove favourite for dog
	 * @param {string} method - HTTP method for request (POST, DELETE e.g.)
	 */
	function fetchFav() {
		return axios(`http://localhost:3000/api/v1/dogs/favs/${dogID}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { data, isSuccess } = useQuery(['fav', dogID], fetchFav, {
		onError: ((error) => console.error(error, `Could not fetch favourite on dog ID ${dogID}`)),
	});

	function postOrDelFav({ method }: Param) {
		return axios(`http://localhost:3000/api/v1/dogs/favs/${dogID}`, {
			method,
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { mutate } = useMutation(postOrDelFav, {
		onSuccess: ((mutationResp) => {
			queryClient.setQueryData(['fav', dogID], mutationResp);
			queryClient.refetchQueries('favs');
		}),
		onError: ((error) => console.error(error)),
	});

	let Icon = HeartOutlined;
	let color = 'black';
	if (isSuccess && data.favourite) {
		Icon = HeartFilled;
		color = 'red';
	}

	function handleClick() {
		const param: Param = { method: 'POST' };
		if (isSuccess && data.favourite) {
			param.method = 'DELETE';
		}
		mutate(param);
	}

	return (
		<Icon style={{ color }} onClick={handleClick} />
	);
}

FavIcon.propTypes = {
	/** Dog ID */
	dogID: PropTypes.number.isRequired,
};

export default FavIcon;

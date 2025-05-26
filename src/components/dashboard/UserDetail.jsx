import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Detail User {id}</h1>
        </div>
    )
}

export default UserDetail

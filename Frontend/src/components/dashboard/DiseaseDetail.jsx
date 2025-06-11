import { useParams } from 'react-router-dom';

const DiseaseDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Detail Disease {id}</h1>
        </div>
    )
}

export default DiseaseDetail

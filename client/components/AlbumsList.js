import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Link } from 'react-router-dom'

//graph
import query from '../queries/fetchAlbumsList'

class AlbumList extends Component {

    deleteAlbum(id) {
        this.props.mutate({
            variables: { id },
            refetchQueries: [{ query }]
        }).then(() =>  this.props.data.refetch())
    }

    updateAlbum(id, title) {
        this.props.mutate({
            variables: { id, title },
            refetchQueries: [{ query }]
        }).then(() => this.props.refetch())
    }

    renderAlbums() {
        const {albums} = this.props.data;
        return albums.map(({id, title}) => (
            <li onClick={() => this.updateAlbum(id, "UPDATED")} key={id} className="collection-item">
                    <Link to={`/albums/${id}`}>
                        {title}
                    </Link>
                <i
                    className="material-icons"
                    onClick={() => this.deleteAlbum(id)}
                >
                    delete
                </i>
            </li>
        ));
    }
    render() {
        const {loading} = this.props.data;
        if(loading) { return <div>Loading....</div> }
        return (
            <div>
                <h3 className="headline">Album Store</h3>
                <ul className="collection">
                    {this.renderAlbums()}
                </ul>
                <Link to="/albums/new" className="btn-floating btn-large red right">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        )
    }
}

const deleteMutation = gql`
    mutation DeleteAlbum($id: ID) {
        deleteAlbum(id: $id) {
            id
        }
    }
`;

const updateMutation = gql`
    mutation UpdateAlbum($id: ID, $title: String) {
        updateAlbum(id: $id, title: $title) {
            title
        }
    }
`;

export default compose(
    graphql(deleteMutation),
    graphql(updateMutation),
    graphql(query))(AlbumList);

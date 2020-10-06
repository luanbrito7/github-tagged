import React, { useState, useEffect } from 'react'
import api from './api';
import './Tag.css'

const Tag = function(props) {

    const [repos, setRepos] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(async () => {
        const { data } = await api.get("")
        console.log(data)
        if (data.tags && data.repos) {
            setTags(data.tags)
            setRepos(data.repos)
        }
    }, [])

    return (
        <div class="container">
            <div class="child-container">
                {repos.map(({name, id}) => (
                    <div key={id}>
                        <p>{name}</p>
                    </div>
                ))}
            </div>
            <div class="child-container">
            {tags.map(({name, _id}) => (
                    <div key={_id}>
                        <p>{name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tag;
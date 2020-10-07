import React, { useState, useEffect } from 'react'
import api from './api';
import './Tag.css'
import plusIcon from './plus.png';
import minusIcon from './minus.png';

const ReposComponent = function({selectedTag, repos, tags, removeRepo, addRepo}) {
    useEffect(() => {}, [selectedTag, repos, tags])
    if (selectedTag === null) {
        return repos.map(({name, id}) => (
            <div className="element-container" key={id+'-none'}>
                <p>{name}</p>
            </div>
        ))
    }
    let presentReposIds = tags[selectedTag].repos
    let selectedRepos = repos.map(({name, id}) => {
        if (presentReposIds.includes(id)) {
            return (
                <div className="row-container" key={id+'-minus'}>
                    <img onClick={() => removeRepo(id)} width={20} height={20} alt="minus" src={minusIcon}></img>
                    <span style={{marginLeft: '15px'}}>{name}</span>
                </div>
            )
        } else {
            return (
                <div className="row-container" key={id+'-plus'}>
                    <img onClick={() => addRepo(id)} width={20} height={20} alt="plus" src={plusIcon}></img>
                    <span style={{marginLeft: '15px'}}>{name}</span>
                </div>
            )
        }
    })
    return selectedRepos
}

const TagsComponent = function({tags, repos, selectedTag, onSelectTag}) {
    let saveTag = () => {
        api.put("/tag", {
            name: tags[selectedTag].name,
            _id: tags[selectedTag]._id,
            repos: tags[selectedTag].repos
        })
    }
    let reposList = (selectedRepos) => (
        selectedRepos.map(({name, id}) => (
            <div className="element-container" key={id+'-list'}>
                <p>{name}</p>
            </div>
        ))
    )
    let selectedTags = tags.map((tag, index) => {
        let {name, _id} = tag
        let reposTag = tag.repos
        if (selectedTag !== index) {
            return (
                <div onClick={() => onSelectTag(index)}
                className="element-container" key={_id}>
                    <p>{name}</p>
                </div>
            )
        } else {
            let selectedRepos = repos.filter(({id}) => {
                return reposTag.includes(id)
            })
            return (
                <div onClick={() => onSelectTag(null)}
                className="element-container selected-container" key={_id}>
                    <p>{name}</p>
                    {reposList(selectedRepos)}
                </div>
            )
        }
    })
    return [...selectedTags, <button onClick={() => saveTag()}>Save tag.</button>]
}

const Tag = function() {

    const [repos, setRepos] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { data } = await api.get("")
            if (data.tags && data.repos) {
                setTags(data.tags)
                setRepos(data.repos)
            }
        }
        fetchData()
    }, [])

    function onSelectTag(index) {
        setSelectedTag(index)
    }

    function addRepo(id) {
        let updatedTags = [...tags]
        updatedTags[selectedTag].repos.push(id)
        setTags(updatedTags)
    }

    function removeRepo(id) {
        let updatedTags = [...tags]
        let index = updatedTags[selectedTag].repos.indexOf(id);
        updatedTags[selectedTag].repos.splice(index, 1)
        setTags(updatedTags)
    }

    return (
        <div className="container">
            <div className="section">
                <div className="element-container">
                    <h2>Starred Repos</h2>
                </div>
                <ReposComponent tags={tags} repos={repos} selectedTag={selectedTag} addRepo={addRepo} removeRepo={removeRepo} />
            </div>
            <div className="section">
                <div className="element-container">
                    <h2>Tags</h2>
                </div>
                <TagsComponent repos={repos} tags={tags} selectedTag={selectedTag} onSelectTag={onSelectTag} />
            </div>
        </div>
    )
}

export default Tag;
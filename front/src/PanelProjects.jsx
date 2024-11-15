import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './PanelProjects.css';

const PanelProjects = () => {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ image: '', nom: '', annee: '', description: '', animateurs: [] });
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
        fetchImages();
        fetchUsers();
    }, []);

    const checkAuthentication = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/status', { withCredentials: true });
            if (!response.data.loggedIn) {
                navigate('/login');
            } else {
                fetchProjects();
            }
        } catch (error) {
            navigate('/login');
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects', { withCredentials: true });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error.response ? error.response.data : error.message);
        }
    };

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/upload/', { withCredentials: true });
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error.response ? error.response.data : error.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('photo', file);

        try {
            await axios.post('http://localhost:5000/api/upload', formData, {withCredentials: true}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchImages(); // Refresh the list of images
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageSelect = (event) => {
        const selectedImageName = event.target.value;
        const selectedImage = images.find(image => `/uploads/${image}` === selectedImageName);
        setSelectedImage(selectedImage);
        setForm({ ...form, image: selectedImageName });
    };

    const handleImageDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/upload/${selectedImage}`, { withCredentials: true });
            setSelectedImage(null);
            fetchImages(); // Refresh the list of images after deletion
        } catch (error) {
            console.error('Error deleting image:', error.response ? error.response.data : error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectChange = (selectedOptions) => {
        const selectedAnimateurs = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setForm({ ...form, animateurs: selectedAnimateurs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProjectId) {
                await axios.put(`http://localhost:5000/api/projects/${editingProjectId}`, form, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/api/projects', form, { withCredentials: true });
            }
            setForm({ image: '', nom: '', annee: '', description: '', animateurs: []});
            setEditingProjectId(null);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error.response ? error.response.data : error.message);
        }
    };

    const handleEdit = (project) => {
        setForm({ image: project.image, nom: project.nom, annee: project.annee, description: project.description, animateurs: project.animateurs});
        setEditingProjectId(project._id);
    };

    const handleDelete = async (projectId) => {
        try {
            await axios.delete(`http://localhost:5000/api/projects/${projectId}`, { withCredentials: true });
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="panel-projects">
            <h1>Panel Projects</h1>
            <form onSubmit={handleSubmit} className="project-form">
                <input type="text" name="nom" value={form.nom} onChange={handleInputChange} placeholder="Project Name" required />
                <input type="number" name="annee" value={form.annee} onChange={handleInputChange} placeholder="Year" required />
                <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
                <select name="image" value={form.image} onChange={handleImageSelect} required>
                    <option value="">Select an image</option>
                    {images.map((image, index) => (
                        <option key={index} value={`/uploads/${image}`}>{image}</option>
                    ))}
                </select>
                <Select
                    isMulti
                    name="animateurs"
                    options={users.map(user => ({ value: user._id, label: `${user.nom} ${user.prenom}` }))}
                    value={users.filter(user => form.animateurs.includes(user._id)).map(user => ({ value: user._id, label: `${user.nom} ${user.prenom}` }))}
                    onChange={handleSelectChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                {selectedImage && (
                    <button type="button" onClick={handleImageDelete}>Delete Selected Image</button>
                )}
                <input type="file" onChange={handleImageUpload} />
                <button type="submit">{editingProjectId ? 'Update Project' : 'Create Project'}</button>
            </form>
            <table className="project-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Animateurs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project._id}>
                            <td><img src={`http://localhost:5000/api/upload/${project.image.split('/').pop()}`} alt={project.nom} width="50" /></td>
                            <td>{project.nom}</td>
                            <td>{project.annee}</td>
                            <td>{project.description}</td>
                            <td>{project.animateurs.map(anim => {
                                const user = users.find(user => user._id === anim);
                                return user ? `${user.nom} ${user.prenom}` : '';
                            }).join(', ')}</td>
                            <td>
                                <button onClick={() => handleEdit(project)}>Edit</button>
                                <button onClick={() => handleDelete(project._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PanelProjects;
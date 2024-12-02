import React from 'react';

const Documentation = () => {
    return (
        <>
            { }
            <h1 style={{
                textAlign: 'center',
                fontSize: '36px',
                marginTop: '20px',
                marginBottom: '40px',
                fontWeight: 'bold',
            }}>GeoExplorer Documentation</h1>

            { }
            <div style={{
                fontFamily: 'Arial, sans-serif',
                backgroundColor: 'rgba(31, 31, 31, 0.9)',
                color: 'white',
                padding: '20px',
                margin: '20px auto',
                fontSize: '16px',
                lineHeight: '1.6',
                borderRadius: '8px',
                maxWidth: '900px',
                overflowY: 'auto',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>

                {/* Overview Section */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px', textDecoration: 'underline' }}>Overview</h2>
                    <p>
                        GeoExplorer is an interactive, web-based globe application that allows users to visually explore geographical data.
                        It provides an intuitive interface for rotating and zooming in on a globe, where users can click on countries to
                        view detailed information such as the country’s name, capital, and population. The globe is rendered using
                        <strong> Three.js</strong>, and the country outlines are based on GeoJSON data, providing accurate geographical representation.
                    </p>
                    <p>
                        * Please note that this is just a demo. The final product is still in development.
                    </p>
                </section>

                {/* Key Features Section */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px', textDecoration: 'underline' }}>Key Features</h2>
                    <p>
                        <strong>Interactive Globe:</strong> Users can rotate, zoom, and explore the globe to find countries.
                    </p>
                    <p>
                        <strong>Country Data:</strong> Clicking on a country provides information like its name, latitude, longitude, capital, and population.
                    </p>
                    <p>
                        <strong>Smooth User Interface:</strong> The interface allows easy navigation with orbit controls.
                    </p>
                    <p>
                        <strong>Responsive Design:</strong> The application adjusts to different screen sizes and resolutions.
                    </p>
                </section>

                {/* Technologies Used Section */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px', textDecoration: 'underline' }}>Technologies Used</h2>
                    <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>Frontend</h3>
                    <p>
                        <strong>React:</strong> The JavaScript library used to build the user interface.
                    </p>
                    <p>
                        <strong>Three.js:</strong> A 3D library for rendering the interactive globe and handling the rendering of country outlines.
                    </p>
                    <p>
                        <strong>OrbitControls:</strong> A component from Three.js that enables user interaction with the globe.
                    </p>
                    <h3 style={{ fontSize: '20px', marginBottom: '5px', marginTop: '10px' }}>Backend</h3>
                    <p>
                        <strong>GeoJSON:</strong> A format used to represent geographic data, utilized to display country outlines.
                    </p>
                </section>

                {/* Utilization Instructions Section */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px', textDecoration: 'underline' }}>Utilization Instructions</h2>
                    <p>To run GeoExplorer, navigate to the link (https://geoexplorer-59a54.web.app/) or <a href="https://geoexplorer-59a54.web.app/" target="_blank" rel="noopener noreferrer" style={{
                        color: 'white',
                        textDecoration: 'underline',
                    }}>click here</a>.</p>
                </section>

                {/* Features and Functionality Section */}
                <section>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px', textDecoration: 'underline' }}>Features and Functionality</h2>
                    <p>
                        The GeoExplorer application features a 3D globe rendered with <strong>Three.js</strong>. Users can interact with the globe by rotating, zooming, and clicking on countries to display relevant data.
                        The application uses <strong>GeoJSON</strong> data to create country outlines on the globe, which are clickable to reveal information such as the country name, capital, and geographic coordinates.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Documentation;

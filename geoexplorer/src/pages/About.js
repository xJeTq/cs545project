const About = () => {
  console.log('About component rendered');
  return (
    <div className='About'>
      <h1>About GeoExplorer.</h1>
      <p style={{
        backgroundColor: 'rgba(31, 31, 31, 0.9)',
        color: 'white',
        padding: '20px',
        margin: '15px',
        marginLeft: '250px',
        marginRight: '250px',
        fontSize: '16px',
        lineHeight: '30px',
        borderRadius: '8px'
      }}>
        GeoExplorer is an interactive web-based globe application designed to allow users to explore geographical data visually. Users can click on countries on the globe to view detailed information about each country, such as its name, capital and population. The globe is rendered using Three.js, and the country outlines are generated from public GeoJSON data. The application provides a smooth and intuitive user interface, allowing users to freely navigate around the globe.
      </p>
      <p style={{
        backgroundColor: 'rgba(31, 31, 31, 0.9)',
        color: 'white',
        padding: '20px',
        margin: '15px',
        marginLeft: '250px',
        marginRight: '250px',
        fontSize: '16px',
        lineHeight: '30px',
        borderRadius: '8px'
      }}>
        To read documentation, <a href="https://drive.google.com/file/d/1vkBjCwVGonD4lvaxQcOell1XVAlXUNhW/view?usp=drive_link" style={{ color: 'white', textDecoration: 'underline' }}>click here</a>.
      </p>
      <p style={{
        position: 'absolute',
        bottom: '50px'
      }}>CS 545: Human Computer Interaction</p>
      <p style={{
        position: 'absolute',
        bottom: '30px',
      }}>Fall 2024</p>
      <p style={{
        position: 'absolute',
        bottom: '10px'
      }}>Anthony Curcio-Petraccoro, Andrew Krasinski, Harrison Huston, Dean Zazzera</p>
    </div>
  );
};

export default About;

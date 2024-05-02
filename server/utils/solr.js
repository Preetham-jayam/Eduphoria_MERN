const solr = require('solr-node');
const Course = require('../models/course'); 

const client = new solr({
  host: 'localhost',
  port: '8983',
  core: 'courses' 
});


async function indexCourses() {
  try {
    const courses = await Course.find();
    for (const course of courses) {
      const solrDoc = {
        id: course._id.toString(),
        title: course.title,
        name: course.name,
        description: course.description,
        Imageurl: course.Imageurl,
        price: course.price,
        instructorName: course.instructorName
      };
      
      // Index the course document into Solr
      await client.update(solrDoc);
    }

    // Commit changes to make them visible in Solr
    await client.commit();

    console.log('Courses indexed successfully');
  } catch (error) {
    console.error('Error indexing courses:', error);
    throw error;
  }
}

async function searchCourses(query) {
  try {
    const params = {
      q: `title:${query}`, 
      wt: 'json',
    };
    const response = await client.query('select', params);
    return response.response.docs;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
}

// indexCourses();

// const query = 'Node.js';
// searchCourses(query)
//   .then(results => {
//     console.log('Search results:', results);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

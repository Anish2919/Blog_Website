import React from 'react';

const Post = () => {
  return (
      <div className="post">
          <div className="image">
            <img className='bordershadow-md hover:shadow-lg' src="https://hardwarepasal.com/src/img/productcategory/brush%20cutter.jpg" alt="Image_Name" />
          </div>
          <div className="texts">
            <h2>Grass Cutting Machine Makes Trimming Grass Lawn Easy</h2>
            <p className="info">
              <a href="" className='author'>David Paszko</a>
              <time>2023-08-05 16:45</time>
            </p>
            <p className='summary'>Grass cutting equipment uses single or multiple blades to cut a grass surface up to a uniform height. Here, the height of the grass you should cut remains fixed. However, operators may adjust the grass-cutting device by using a single master lever or by the combination of a nut and bolt on each machine wheel. Regardless of the adjustment feature, a grass cutter trims the lawn grass more easily than other equipment in the agricultural industry. Here, you will know a few benefits and types of grass cutting equipment.</p>
          </div>
        </div>
  );
}

export default Post;

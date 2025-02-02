import React, { useState } from 'react';

import { Card, Badge, Button, Collapse } from 'react-bootstrap';

// react-markdown
import ReactMarkDown from 'react-markdown';

const Job = ({ job }) => {
  // console.log('re rendered job component');

  const [open, setOpen] = useState(false);

  const handleCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Card className='mb-3'>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <div>
            <Card.Title>
              {job.title} -{' '}
              <span className='text-muted font-weight-light'>
                {job.company}
              </span>
            </Card.Title>

            <Card.Subtitle className='text-muted mb-2'>
              {new Date(job.created_at).toLocaleDateString()}
            </Card.Subtitle>

            <Badge variant='secondary' className='mr-2'>
              {job.type}
            </Badge>
            <Badge variant='secondary'>{job.location}</Badge>

            <div style={{ wordBreak: 'break-all' }}>
              <ReactMarkDown source={job.how_to_apply} />
            </div>
          </div>

          <div>
            <img
              className='d-none d-md-block'
              style={{ objectFit: 'contain' }}
              width='100'
              src={job.company_logo}
              alt={job.company}
            />
          </div>
        </div>

        <Card.Text>
          <Button onClick={handleCollapse} variant='primary'>
            {!open ? 'View Details' : 'Hide Details'}
          </Button>
        </Card.Text>

        <Collapse in={open}>
          <div className='mt-4'>
            <ReactMarkDown source={job.description} />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default Job;

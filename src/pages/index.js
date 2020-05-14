import React from 'react'
import Layout from '../components/Layout'
import Button from 'antd/lib/button'
import 'antd/lib/button/style/css'
import { Link } from 'gatsby'

const IndexPage = () => {
  return (
    <Layout>
      <div>
        <div align="center">
          <br />
          <p
            style={{
              color: 'cornflowerblue',
              fontSize: 50,
              fontWeight: 'bold',
            }}
          >
            Canban
          </p>
          <h2>Kanban board with React integration</h2>
          <br />
          <Link to="/docs/canban/
">
            <Button
              type="primary"
              size="large"
              icon="right-circle"
              style={{ marginRight: 10 }}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

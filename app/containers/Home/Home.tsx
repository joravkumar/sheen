import React from 'react';
import { Button, Card } from 'antd';
import { History } from 'history';
import styles from './Home.css';

interface Props {
  history: History;
}

export default function Home(props: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1>Sheen</h1>
        <hr />
        <div className={styles['btn-wrapper']}>
          <Button
            type="primary"
            onClick={() => props.history.push('/share-screen/1323423')}
          >
            Share Your Screen
          </Button>
          <Button onClick={() => props.history.push('/join')}>
            Join Remote Screen
          </Button>
        </div>
      </Card>
    </div>
  );
}

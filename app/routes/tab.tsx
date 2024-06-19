import { useOutlet, useLocation, Link } from '@remix-run/react';
import { KeepAlive } from '@szxfml/pkgs'
import { useState, useMemo } from 'react';

const Tab = ({ name }) => {
  return <div>
    <h1>{name}</h1>
  </div>
}


export default function TabPage() {
  const outlet = useOutlet();
  const location = useLocation();


  /**
   * 用于区分不同页面以进行缓存
   */
  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);


  return <div>
    <Link to="/tab/a">tab.a</Link>
    <br />
    <Link to="/tab/b">tab.b</Link>
    <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
      {outlet}
    </KeepAlive>
  </div>
}
import React, { useState, useEffect } from 'react';
import { Collapse, Carousel, Row, Col, } from 'antd';
import useMessage from '@/utils/useMessage';

// 接口
import { getBrainType, getTypeBrain } from '@/apis/demo';

import './index.scss'
export default function Demo () {
  const { error } = useMessage();
  const [brainTypeList, setBrainTypeList] = useState([]);
  const [carouselList, setCarouselList] = useState([])

  // 获取分类列表
  const getTypeList = async () => {
    const { data, code, msg } = await getBrainType();
    if (code === 200) {
      const newData = [{ name: '最近发布', classification_id: 0 }, ...data];
      setBrainTypeList(newData);
    } else {
      error(msg);
    }
  };

  // 获取分类后的数据
  const getTypeBrainInfo = async (classification_id) => {
    const { data, code } = await getTypeBrain({ classification_id })
    if (code === 200) {
      setCarouselList(data.list)
    }
  }

  useEffect(() => {
    getTypeList();
  }, []);

  const onChange = (key) => {
    getTypeBrainInfo(key.toString())
  };

  return (
    <>
      {brainTypeList.length > 0 && (
        <Collapse
          accordion
          bordered={false}
          onChange={onChange}
          items={brainTypeList.map((item, index) => ({
            key: index,
            label: item.name,
            children: (
              <div>
                {<Carousel arrows infinite={false}>
                  {carouselList.map((item) => {
                    return (
                      <div className='brain-item' key={item.id}>
                        {/* <Row gutter={[16, 16]}>
                          <Col span={8} key={item.id}> */}
                        <div className="brain-introduce">
                          <div className="brain-item-logo">
                            <div className="white-mask"></div>
                            <img src={item.image_url} alt="brain" />
                          </div>
                        </div>
                        {/* </Col>
                        </Row> */}
                      </div>
                    )
                  })}
                </Carousel>}
              </div>
            ),
          }))}
        />
      )}
    </>
  );
}

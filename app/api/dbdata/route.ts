import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 创建数据库连接池
const pool = new Pool({
  connectionString: 'postgresql://postgres:zyy!1234*@bozhiyunyu.cn:5432/LightBZYYDB'
});

export async function GET() {
  try {
    // 连接数据库
    const client = await pool.connect();
    
    try {
      // 执行查询，连接AbpUsers和AppChatMessages表
      const query = `
        SELECT u.*, m.*
        FROM "AbpUsers" u
        JOIN "AppChatMessages" m ON u."Id" = m."UserId"
      `;
      
      const result = await client.query(query);
      
      // 返回查询结果作为JSON
      return NextResponse.json(result.rows);
    } finally {
      // 确保释放客户端资源
      client.release();
    }
  } catch (error) {
    console.error('数据库查询错误:', error);
    return NextResponse.json({ error: '数据库查询失败' }, { status: 500 });
  }
}
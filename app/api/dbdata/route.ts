import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { headers } from 'next/headers';

// 创建数据库连接池
const pool = new Pool({
  connectionString: 'postgresql://postgres:zyy!1234*@bozhiyunyu.cn:5432/LightBZYYDB'
});

// 验证请求密码
function validateAuth(request: Request) {
  const headersList = headers();
  const authorization = headersList.get('Authorization');
  
  // 预期格式: 'Bearer Minds@2024!'
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authorization.substring(7);
  return token === 'Minds@2024!';
}

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
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

morgan.token('body', (req: Request) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const body = { ...req.body };
    delete body.password;
    return JSON.stringify(body);
  }
  return '';
});

morgan.token('response-body', (req: Request, res: Response) => {
  return res.locals.responseBody ? JSON.stringify(res.locals.responseBody) : '';
});

const logFormat = ':method :url :status :response-time ms - :res[content-length] :body :response-body';

export const requestLogger = morgan(logFormat, {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  },
  skip: (req) => {
    return req.url === '/api/health' && process.env.NODE_ENV === 'production';
  }
});

export const responseBodyLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    if (typeof body === 'string') {
      try {
        res.locals.responseBody = JSON.parse(body);
      } catch {
        res.locals.responseBody = body;
      }
    } else {
      res.locals.responseBody = body;
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};
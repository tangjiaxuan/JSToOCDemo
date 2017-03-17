//
//  ViewController.m
//  JSDemo
//
//  Created by tjx on 17/3/16.
//  Copyright © 2017年 tjx. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()<UIWebViewDelegate,JSObjcDelegate>
{
    UIWebView *_webView;
}

@property (nonatomic, strong) JSContext *jsContext;

@end

static const NSString *enterprisenumber = @"1007631";
static const NSString *usernumber = @"1220018";
static const NSString *sessionid = @"5B9455A4-6DF4-4FB3-A2A7-D77BCBC87E39";

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.view setBackgroundColor:[UIColor whiteColor]];
    
    _webView = [[UIWebView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    _webView.delegate = self;
    [self.view addSubview:_webView];
    
    NSString *filePath = [[NSBundle mainBundle]pathForResource:@"index" ofType:@"html"];
//    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
//    [_webView loadHTMLString:htmlString baseURL:[NSURL URLWithString:filePath]];
//    NSMutableString *str = [filePath mutableCopy];
//    [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:[str stringByAppendingString:@"?enterprisenumber=1007631&usernumber=1220018&sessionid=5B9455A4-6DF4-4FB3-A2A7-D77BCBC87E39"]]]];
    [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:filePath]]];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark --webViewDelegate
/**
 *  网页加载之前会调用此方法
 *  @return YES 表示正常加载网页 返回NO 将停止网页加载
 */
-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    return YES;
}

/**
 *  开始加载网页调用此方法
 *
 *  @param webView
 */
-(void)webViewDidStartLoad:(UIWebView *)webView
{

}

/**
 *  网页加载完成调用此方法
 *
 *  @param webView
 */
-(void)webViewDidFinishLoad:(UIWebView *)webView
{
    self.jsContext = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
    self.jsContext[@"ios"] = self;
    self.jsContext.exceptionHandler = ^(JSContext *context, JSValue *exceptionValue) {
        context.exception = exceptionValue;
        NSLog(@"异常信息：%@", exceptionValue);
    };
}

/**
 *  网页加载失败 调用此方法
 *
 *  @param webView 
 *  @param error
 */
-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{

}

#pragma mark - JSObjcDelegate

- (void)call{
    NSLog(@"call");
    // 之后在回调js的方法Callback把内容传出去
    JSValue *callback = self.jsContext[@"callback"];
    //传值给web端
    [callback callWithArguments:@[@"view/salemanvisitdetail.html?enterprisenumber=1007631&usernumber=1220018&sessionid=5B9455A4-6DF4-4FB3-A2A7-D77BCBC87E39"]];
}

@end

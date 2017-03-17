//
//  ViewController.h
//  JSDemo
//
//  Created by tjx on 17/3/16.
//  Copyright © 2017年 tjx. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <JavaScriptCore/JavaScriptCore.h>

@protocol JSObjcDelegate <JSExport>
//对象调用的JavaScript方法，必须声明！！！
- (void)call;

@end

@interface ViewController : UIViewController


@end

